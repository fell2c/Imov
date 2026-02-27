package nle.co.Imov.controller;

import nle.co.Imov.model.Anuncio;
import nle.co.Imov.model.Imovel;
import nle.co.Imov.service.AnuncioService;
import nle.co.Imov.service.ImovelService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

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

    // @formatter:off
    @CrossOrigin(origins = "*")
    @GetMapping("/buscar-anuncios/filtros")
    public ResponseEntity<?> buscarAnunciosComFiltros(@RequestParam(required = false) Boolean ativo, @RequestParam(required = false) String descricao,
                                                      @RequestParam(required = false) Integer idAnunciante, @RequestParam(required = false) String tipoImovel,
                                                      @RequestParam(required = false) String tipoNegocio, @RequestParam(required = false) String tipoLocalizacao,
                                                      @RequestParam(required = false) String cidade, @RequestParam(required = false) String uf,
                                                      @RequestParam(required = false) BigDecimal valorMin, @RequestParam(required = false) BigDecimal valorMax,
                                                      @RequestParam(required = false) Integer quartos, @RequestParam(required = false) Integer banheiros,
                                                      @RequestParam(required = false) Integer garagens, @RequestParam(required = false) String categoriaAnuncio,
                                                      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicioMin,
                                                      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFimMax) {
        try {
            return new ResponseEntity<>(anuncioService.getAnunciosComFiltros(ativo, descricao, idAnunciante, tipoImovel, tipoNegocio, tipoLocalizacao, cidade,
                    uf, valorMin, valorMax, quartos, banheiros, garagens, categoriaAnuncio, dataInicioMin, dataFimMax), HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    // @formatter:on
}
