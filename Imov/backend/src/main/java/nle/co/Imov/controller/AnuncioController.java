package nle.co.Imov.controller;

import nle.co.Imov.model.Anuncio;
import nle.co.Imov.model.Anunciante;
import nle.co.Imov.model.Imovel;
import nle.co.Imov.service.AnuncianteService;
import nle.co.Imov.service.AnuncioService;
import nle.co.Imov.service.ImovelService;
import nle.co.Imov.util.StringUtil;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
public class AnuncioController {

    final private AnuncioService anuncioService;

    final private ImovelService imovelService;

    final private AnuncianteService anuncianteService;

    public AnuncioController(AnuncioService anuncioService, ImovelService imovelService, AnuncianteService anuncianteService) {
        this.anuncioService = anuncioService;
        this.imovelService = imovelService;
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
    @PutMapping("/alterar-anuncio")
    public ResponseEntity<?> alterarAnuncio(@RequestBody Anuncio anuncio, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Anunciante logado = getAnuncianteLogado(userDetails);
            if (logado == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            if (anuncio.getId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            Anuncio existente = anuncioService.getAnuncioById(anuncio.getId());
            if (existente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            if (!existente.getAnunciante().getId().equals(logado.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Garante que o anuncio continua pertencendo ao dono autenticado
            anuncio.setAnunciante(logado);
            imovelService.salvar(anuncio.getImovel());
            anuncioService.salvar(anuncio);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/excluir-anuncio/{id}")
    public ResponseEntity<?> excluirAnuncio(@PathVariable Integer id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Anunciante logado = getAnuncianteLogado(userDetails);
            if (logado == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Anuncio anuncio = anuncioService.getAnuncioById(id);
            if (anuncio == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            if (!anuncio.getAnunciante().getId().equals(logado.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Integer imovelId = anuncio.getImovel() != null ? anuncio.getImovel().getId() : null;
            anuncioService.excluir(id);
            if (imovelId != null) {
                imovelService.excluir(imovelId);
            }
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/buscar-anuncio/{id}")
    public ResponseEntity<?> buscarAnuncioPorId(@PathVariable Integer id) {
        try {
            Anuncio anuncio = anuncioService.getAnuncioByIdComRelacoes(id);
            if (anuncio == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return new ResponseEntity<>(anuncio, HttpStatus.OK);
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
