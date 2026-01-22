package nle.co.Imov.service;

import jakarta.transaction.Transactional;
import nle.co.Imov.crudFile.AnuncioCrud;
import nle.co.Imov.model.Anuncio;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Transactional
public class AnuncioService {

    final private AnuncioCrud anuncioCrud;

    public AnuncioService(AnuncioCrud anuncioCrud) {
        this.anuncioCrud = anuncioCrud;
    }

    public Anuncio salvar(Anuncio anuncio) {
        return this.anuncioCrud.save(anuncio);
    }

    public List<Anuncio> getAnuncios() {
        return (List<Anuncio>) this.anuncioCrud.findAll();
    }

    public Anuncio getAnuncioById(Integer id) {
        return this.anuncioCrud.findById(id).orElse(null);
    }
}
