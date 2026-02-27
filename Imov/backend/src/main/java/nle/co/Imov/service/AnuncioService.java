package nle.co.Imov.service;

import jakarta.transaction.Transactional;
import nle.co.Imov.crudFile.AnuncioCrud;
import nle.co.Imov.model.Anuncio;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
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

    public List<Anuncio> getAnunciosComFiltros(Boolean ativo, String descricao, Integer idAnunciante, String tipoImovel, String tipoNegocio, String tipoLocalizacao, String cidade, String uf, BigDecimal valorMin, BigDecimal valorMax, Integer quartos, Integer banheiros, Integer garagens, String categoriaAnuncio, LocalDate dataInicioMin, LocalDate dataFimMax) {
        return this.anuncioCrud.buscarComFiltros(ativo, descricao, idAnunciante, tipoImovel, tipoNegocio, tipoLocalizacao, cidade, uf, valorMin, valorMax, quartos, banheiros, garagens, categoriaAnuncio, dataInicioMin, dataFimMax);
    }
}
