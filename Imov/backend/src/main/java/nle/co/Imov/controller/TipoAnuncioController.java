package nle.co.Imov.controller;

import nle.co.Imov.service.TipoAnuncioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TipoAnuncioController {

    final private TipoAnuncioService tipoAnuncioService;

    public TipoAnuncioController(TipoAnuncioService tipoAnuncioService) {
        this.tipoAnuncioService = tipoAnuncioService;
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/buscar-tipos-anuncio")
    public ResponseEntity<?> buscarTiposAnuncio() {
        try {
            return new ResponseEntity<>(tipoAnuncioService.getTiposAnuncio(), HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
