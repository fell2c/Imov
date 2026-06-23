package nle.co.Imov.controller;

import nle.co.Imov.model.Anunciante;
import nle.co.Imov.model.Imovel;
import nle.co.Imov.service.AnuncianteService;
import nle.co.Imov.service.AnuncioService;
import nle.co.Imov.service.ImagemService;
import nle.co.Imov.service.ImovelService;
import nle.co.Imov.util.StringUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class ImagemController {

    private final ImagemService imagemService;
    private final ImovelService imovelService;
    private final AnuncioService anuncioService;
    private final AnuncianteService anuncianteService;

    public ImagemController(ImagemService imagemService, ImovelService imovelService,
                            AnuncioService anuncioService, AnuncianteService anuncianteService) {
        this.imagemService = imagemService;
        this.imovelService = imovelService;
        this.anuncioService = anuncioService;
        this.anuncianteService = anuncianteService;
    }

    /** Resolve o anunciante autenticado a partir do token (subject = e-mail ou CPF/CNPJ). */
    private Anunciante getAnuncianteLogado(UserDetails userDetails) {
        if (userDetails == null) {
            return null;
        }
        String login = userDetails.getUsername();
        if (StringUtil.isEmailValido(login)) {
            return anuncianteService.getAnuncianteByEmail(login);
        }
        return anuncianteService.getAnuncianteByCpf(login);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/imovel/{idImovel}/imagens")
    public ResponseEntity<?> uploadImagens(@PathVariable Integer idImovel, @RequestParam("files") MultipartFile[] files,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Anunciante logado = getAnuncianteLogado(userDetails);
            if (logado == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Imovel imovel = imovelService.getImovelById(idImovel);
            if (imovel == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            // Garante que o imovel pertence a um anuncio do usuario logado
            if (!anuncioService.imovelPertenceAoAnunciante(idImovel, logado.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            if (files == null || files.length == 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            List<String> nomes = imagemService.salvarImagens(imovel, files);
            return new ResponseEntity<>(nomes, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
