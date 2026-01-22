package nle.co.Imov.crudFile;

import nle.co.Imov.model.Anuncio;
import org.springframework.data.repository.CrudRepository;

public interface AnuncioCrud extends CrudRepository<Anuncio, Integer> {
}
