package nle.co.Imov.controller;

import nle.co.Imov.model.Anunciante;
import nle.co.Imov.service.AnuncianteService;
import nle.co.Imov.util.PasswordUtil;
import nle.co.Imov.util.StringUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AnuncianteController {

    final private AnuncianteService anuncianteService;

    public AnuncianteController(AnuncianteService anuncianteService) {
        this.anuncianteService = anuncianteService;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/cadastrar-anunciante")
    public ResponseEntity<?> cadastrarAnunciante(@RequestBody Anunciante anunciante) {
        try {
            if (!StringUtil.isCNPJCPFValido(anunciante.getCpfCnpj())) {
                return new ResponseEntity<>("CPF inválido", HttpStatus.BAD_REQUEST);
            }

            anunciante.setCpfCnpj(StringUtil.getOnlyNumbers(anunciante.getCpfCnpj()));
            anunciante.setSenha(PasswordUtil.encriptarSenha(anunciante.getSenha()));
            anuncianteService.salvar(anunciante);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/buscar-anunciantes")
    public ResponseEntity<?> buscarAnunciantes() {
        try {
            return new ResponseEntity<>(anuncianteService.getAnunciantes(), HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // @formatter:off
    @CrossOrigin(origins = "*")
    @GetMapping("/buscar-anunciantes/filtros")
    public ResponseEntity<?> buscarAnunciantesComFiltros(@RequestParam(required = false) String nome, @RequestParam(required = false) String email,
                                                         @RequestParam(required = false) String cpfCnpj, @RequestParam(required = false) String cidade,
                                                         @RequestParam(required = false) String uf, @RequestParam(required = false) String tipoLocalizacao) {
        try {
            return new ResponseEntity<>(anuncianteService.getAnunciantesComFiltros(nome, email, cpfCnpj, cidade, uf, tipoLocalizacao), HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    // @formatter:on
}
