package nle.co.Imov.controller;

import nle.co.Imov.model.Anunciante;
import nle.co.Imov.service.AnuncianteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AnuncianteControllerTest {

    private AnuncianteService anuncianteService;
    private AnuncianteController controller;

    @BeforeEach
    void setUp() {
        anuncianteService = mock(AnuncianteService.class);
        controller = new AnuncianteController(anuncianteService);
    }

    private Anunciante novoAnunciante() {
        Anunciante a = new Anunciante();
        a.setNome("Dono Teste");
        a.setEmail("dono@example.com");
        a.setCpfCnpj("529.982.247-25");
        a.setSenha("senha123");
        return a;
    }

    @Test
    void cadastrar_deveRetornar400_quandoCpfInvalido() {
        Anunciante a = novoAnunciante();
        a.setCpfCnpj("12345678900");

        ResponseEntity<?> resposta = controller.cadastrarAnunciante(a);

        assertEquals(HttpStatus.BAD_REQUEST, resposta.getStatusCode());
        verify(anuncianteService, never()).salvar(any());
    }

    @Test
    void cadastrar_deveRetornar409_quandoEmailJaExiste() {
        Anunciante a = novoAnunciante();
        when(anuncianteService.getAnuncianteByEmail("dono@example.com")).thenReturn(new Anunciante());

        ResponseEntity<?> resposta = controller.cadastrarAnunciante(a);

        assertEquals(HttpStatus.CONFLICT, resposta.getStatusCode());
        verify(anuncianteService, never()).salvar(any());
    }

    @Test
    void cadastrar_deveRetornar409_quandoCpfJaExiste() {
        Anunciante a = novoAnunciante();
        when(anuncianteService.getAnuncianteByEmail(anyString())).thenReturn(null);
        when(anuncianteService.getAnuncianteByCpf("52998224725")).thenReturn(new Anunciante());

        ResponseEntity<?> resposta = controller.cadastrarAnunciante(a);

        assertEquals(HttpStatus.CONFLICT, resposta.getStatusCode());
        verify(anuncianteService, never()).salvar(any());
    }

    @Test
    void cadastrar_deveRetornar200_eSalvarComCpfNormalizadoESenhaCriptografada() {
        Anunciante a = novoAnunciante();
        when(anuncianteService.getAnuncianteByEmail(anyString())).thenReturn(null);
        when(anuncianteService.getAnuncianteByCpf(anyString())).thenReturn(null);

        ResponseEntity<?> resposta = controller.cadastrarAnunciante(a);

        assertEquals(HttpStatus.OK, resposta.getStatusCode());
        // CPF deve ter sido normalizado (so digitos) e a senha nao pode ser a original
        assertEquals("52998224725", a.getCpfCnpj());
        assertNotEquals("senha123", a.getSenha());
        verify(anuncianteService, times(1)).salvar(a);
    }
}
