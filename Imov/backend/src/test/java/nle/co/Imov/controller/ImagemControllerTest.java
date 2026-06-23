package nle.co.Imov.controller;

import nle.co.Imov.model.Anunciante;
import nle.co.Imov.model.Imovel;
import nle.co.Imov.service.AnuncianteService;
import nle.co.Imov.service.AnuncioService;
import nle.co.Imov.service.ImagemService;
import nle.co.Imov.service.ImovelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ImagemControllerTest {

    private ImagemService imagemService;
    private ImovelService imovelService;
    private AnuncioService anuncioService;
    private AnuncianteService anuncianteService;
    private ImagemController controller;

    private static final String EMAIL_LOGADO = "dono@example.com";

    @BeforeEach
    void setUp() {
        imagemService = mock(ImagemService.class);
        imovelService = mock(ImovelService.class);
        anuncioService = mock(AnuncioService.class);
        anuncianteService = mock(AnuncianteService.class);
        controller = new ImagemController(imagemService, imovelService, anuncioService, anuncianteService);
    }

    private UserDetails userDetails() {
        return new User(EMAIL_LOGADO, "x", Collections.emptyList());
    }

    private Anunciante anunciante(int id) {
        Anunciante a = new Anunciante();
        a.setId(id);
        return a;
    }

    private Imovel imovel(int id) {
        Imovel im = new Imovel();
        im.setId(id);
        return im;
    }

    private MultipartFile[] umArquivo() {
        return new MultipartFile[]{ mock(MultipartFile.class) };
    }

    @Test
    void upload_semLogin_deveRetornar401() {
        ResponseEntity<?> resposta = controller.uploadImagens(7, umArquivo(), null);
        assertEquals(HttpStatus.UNAUTHORIZED, resposta.getStatusCode());
    }

    @Test
    void upload_imovelInexistente_deveRetornar404() {
        when(anuncianteService.getAnuncianteByEmail(EMAIL_LOGADO)).thenReturn(anunciante(1));
        when(imovelService.getImovelById(7)).thenReturn(null);
        ResponseEntity<?> resposta = controller.uploadImagens(7, umArquivo(), userDetails());
        assertEquals(HttpStatus.NOT_FOUND, resposta.getStatusCode());
    }

    @Test
    void upload_naoDono_deveRetornar403() {
        when(anuncianteService.getAnuncianteByEmail(EMAIL_LOGADO)).thenReturn(anunciante(1));
        when(imovelService.getImovelById(7)).thenReturn(imovel(7));
        when(anuncioService.imovelPertenceAoAnunciante(7, 1)).thenReturn(false);

        ResponseEntity<?> resposta = controller.uploadImagens(7, umArquivo(), userDetails());

        assertEquals(HttpStatus.FORBIDDEN, resposta.getStatusCode());
    }

    @Test
    void upload_semArquivos_deveRetornar400() {
        when(anuncianteService.getAnuncianteByEmail(EMAIL_LOGADO)).thenReturn(anunciante(1));
        when(imovelService.getImovelById(7)).thenReturn(imovel(7));
        when(anuncioService.imovelPertenceAoAnunciante(7, 1)).thenReturn(true);

        ResponseEntity<?> resposta = controller.uploadImagens(7, new MultipartFile[]{}, userDetails());

        assertEquals(HttpStatus.BAD_REQUEST, resposta.getStatusCode());
    }

    @Test
    void upload_dono_deveSalvarERetornar200() throws Exception {
        when(anuncianteService.getAnuncianteByEmail(EMAIL_LOGADO)).thenReturn(anunciante(1));
        when(imovelService.getImovelById(7)).thenReturn(imovel(7));
        when(anuncioService.imovelPertenceAoAnunciante(7, 1)).thenReturn(true);
        when(imagemService.salvarImagens(any(), any())).thenReturn(List.of("uuid.png"));

        ResponseEntity<?> resposta = controller.uploadImagens(7, umArquivo(), userDetails());

        assertEquals(HttpStatus.OK, resposta.getStatusCode());
        verify(imagemService, times(1)).salvarImagens(any(), any());
    }
}
