package nle.co.Imov.controller;

import nle.co.Imov.model.Anunciante;
import nle.co.Imov.model.Anuncio;
import nle.co.Imov.model.Imovel;
import nle.co.Imov.service.AnuncianteService;
import nle.co.Imov.service.AnuncioService;
import nle.co.Imov.service.ImovelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AnuncioControllerTest {

    private AnuncioService anuncioService;
    private ImovelService imovelService;
    private AnuncianteService anuncianteService;
    private AnuncioController controller;

    private static final String EMAIL_LOGADO = "dono@example.com";

    @BeforeEach
    void setUp() {
        anuncioService = mock(AnuncioService.class);
        imovelService = mock(ImovelService.class);
        anuncianteService = mock(AnuncianteService.class);
        controller = new AnuncioController(anuncioService, imovelService, anuncianteService);
    }

    private UserDetails userDetails() {
        return new User(EMAIL_LOGADO, "x", Collections.emptyList());
    }

    private Anunciante anunciante(int id) {
        Anunciante a = new Anunciante();
        a.setId(id);
        return a;
    }

    private Anuncio anuncioComImovel(Integer id, int idDono) {
        Anuncio anuncio = new Anuncio();
        anuncio.setId(id);
        anuncio.setAnunciante(anunciante(idDono));
        Imovel imovel = new Imovel();
        imovel.setId(99);
        anuncio.setImovel(imovel);
        return anuncio;
    }

    // ---------- cadastrar ----------

    @Test
    @SuppressWarnings("unchecked")
    void cadastrar_deveSalvarERetornarIds() {
        Anuncio entrada = new Anuncio();
        Imovel imovel = new Imovel();
        entrada.setImovel(imovel);

        Imovel imovelSalvo = new Imovel();
        imovelSalvo.setId(10);
        Anuncio anuncioSalvo = new Anuncio();
        anuncioSalvo.setId(20);

        when(imovelService.salvar(any())).thenReturn(imovelSalvo);
        when(anuncioService.salvar(any())).thenReturn(anuncioSalvo);

        ResponseEntity<?> resposta = controller.cadastrarAnuncio(entrada);

        assertEquals(HttpStatus.OK, resposta.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) resposta.getBody();
        assertNotNull(body);
        assertEquals(20, body.get("id"));
        assertEquals(10, body.get("imovelId"));
    }

    // ---------- alterar ----------

    @Test
    void alterar_semLogin_deveRetornar401() {
        ResponseEntity<?> resposta = controller.alterarAnuncio(anuncioComImovel(1, 1), null);
        assertEquals(HttpStatus.UNAUTHORIZED, resposta.getStatusCode());
    }

    @Test
    void alterar_semId_deveRetornar400() {
        when(anuncianteService.getAnuncianteByEmail(EMAIL_LOGADO)).thenReturn(anunciante(1));
        ResponseEntity<?> resposta = controller.alterarAnuncio(anuncioComImovel(null, 1), userDetails());
        assertEquals(HttpStatus.BAD_REQUEST, resposta.getStatusCode());
    }

    @Test
    void alterar_inexistente_deveRetornar404() {
        when(anuncianteService.getAnuncianteByEmail(EMAIL_LOGADO)).thenReturn(anunciante(1));
        when(anuncioService.getAnuncioById(5)).thenReturn(null);
        ResponseEntity<?> resposta = controller.alterarAnuncio(anuncioComImovel(5, 1), userDetails());
        assertEquals(HttpStatus.NOT_FOUND, resposta.getStatusCode());
    }

    @Test
    void alterar_naoDono_deveRetornar403() {
        when(anuncianteService.getAnuncianteByEmail(EMAIL_LOGADO)).thenReturn(anunciante(1));
        when(anuncioService.getAnuncioById(5)).thenReturn(anuncioComImovel(5, 2)); // dono diferente
        ResponseEntity<?> resposta = controller.alterarAnuncio(anuncioComImovel(5, 2), userDetails());
        assertEquals(HttpStatus.FORBIDDEN, resposta.getStatusCode());
        verify(anuncioService, never()).salvar(any());
    }

    @Test
    void alterar_dono_deveSalvarERetornar200() {
        when(anuncianteService.getAnuncianteByEmail(EMAIL_LOGADO)).thenReturn(anunciante(1));
        when(anuncioService.getAnuncioById(5)).thenReturn(anuncioComImovel(5, 1));

        ResponseEntity<?> resposta = controller.alterarAnuncio(anuncioComImovel(5, 1), userDetails());

        assertEquals(HttpStatus.OK, resposta.getStatusCode());
        verify(imovelService, times(1)).salvar(any());
        verify(anuncioService, times(1)).salvar(any());
    }

    // ---------- excluir ----------

    @Test
    void excluir_semLogin_deveRetornar401() {
        ResponseEntity<?> resposta = controller.excluirAnuncio(5, null);
        assertEquals(HttpStatus.UNAUTHORIZED, resposta.getStatusCode());
    }

    @Test
    void excluir_inexistente_deveRetornar404() {
        when(anuncianteService.getAnuncianteByEmail(EMAIL_LOGADO)).thenReturn(anunciante(1));
        when(anuncioService.getAnuncioById(5)).thenReturn(null);
        ResponseEntity<?> resposta = controller.excluirAnuncio(5, userDetails());
        assertEquals(HttpStatus.NOT_FOUND, resposta.getStatusCode());
    }

    @Test
    void excluir_naoDono_deveRetornar403() {
        when(anuncianteService.getAnuncianteByEmail(EMAIL_LOGADO)).thenReturn(anunciante(1));
        when(anuncioService.getAnuncioById(5)).thenReturn(anuncioComImovel(5, 2));
        ResponseEntity<?> resposta = controller.excluirAnuncio(5, userDetails());
        assertEquals(HttpStatus.FORBIDDEN, resposta.getStatusCode());
        verify(anuncioService, never()).excluir(any());
    }

    @Test
    void excluir_dono_deveExcluirImovelEAnuncioERetornar200() {
        when(anuncianteService.getAnuncianteByEmail(EMAIL_LOGADO)).thenReturn(anunciante(1));
        when(anuncioService.getAnuncioById(5)).thenReturn(anuncioComImovel(5, 1));

        ResponseEntity<?> resposta = controller.excluirAnuncio(5, userDetails());

        assertEquals(HttpStatus.OK, resposta.getStatusCode());
        verify(anuncioService, times(1)).excluir(5);
        verify(imovelService, times(1)).excluir(99);
    }
}
