package nle.co.Imov.controller;

import nle.co.Imov.model.Anuncio;
import nle.co.Imov.model.Imovel;
import nle.co.Imov.service.AnuncioService;
import nle.co.Imov.service.ImovelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AnuncioController {

    final private AnuncioService anuncioService;

    final private ImovelService imovelService;

    public AnuncioController(AnuncioService anuncioService, ImovelService imovelService) {
        this.anuncioService = anuncioService;
        this.imovelService = imovelService;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/cadastrar-anuncio")
    public ResponseEntity<?> cadastrarAnuncio(@RequestBody Anuncio anuncio) {
        try {
            Imovel imovelSalvo = imovelService.salvar(anuncio.getImovel());

            anuncio.setImovel(imovelSalvo);

            anuncioService.salvar(anuncio);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/buscar-anuncios")
    public ResponseEntity<?> buscarAnuncios() {
        try {
            return new ResponseEntity<>(anuncioService.getAnuncios(), HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
