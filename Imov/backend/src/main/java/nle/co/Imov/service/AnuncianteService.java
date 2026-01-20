package nle.co.Imov.service;

import jakarta.transaction.Transactional;
import nle.co.Imov.crudFile.AnuncianteCrud;
import nle.co.Imov.model.Anunciante;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Transactional
public class AnuncianteService {

    final private AnuncianteCrud anuncianteCrud;

    public AnuncianteService(AnuncianteCrud anuncianteCrud) {
        this.anuncianteCrud = anuncianteCrud;
    }

    public Anunciante salvar(Anunciante anunciante) {
        return this.anuncianteCrud.save(anunciante);
    }

    public List<Anunciante> getAnunciantes() {
        return (List<Anunciante>) this.anuncianteCrud.findAll();
    }

    public Anunciante getAnuncianteById(Integer id) {
        return this.anuncianteCrud.findById(id).orElse(null);
    }

    public Anunciante getAnuncianteByCpf(String cpf) {
        return this.anuncianteCrud.findAnuncianteByCpfCnpj(cpf);
    }

    public Anunciante getAnuncianteByEmail(String email) {
        return this.anuncianteCrud.findAnuncianteByEmail(email);
    }
}
