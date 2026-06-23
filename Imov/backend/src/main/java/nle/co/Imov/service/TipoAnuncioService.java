package nle.co.Imov.service;

import jakarta.transaction.Transactional;
import nle.co.Imov.crudFile.TipoAnuncioCrud;
import nle.co.Imov.model.TipoAnuncio;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Transactional
public class TipoAnuncioService {

    final private TipoAnuncioCrud tipoAnuncioCrud;

    public TipoAnuncioService(TipoAnuncioCrud tipoAnuncioCrud) {
        this.tipoAnuncioCrud = tipoAnuncioCrud;
    }

    public List<TipoAnuncio> getTiposAnuncio() {
        return (List<TipoAnuncio>) this.tipoAnuncioCrud.findAll();
    }
}
