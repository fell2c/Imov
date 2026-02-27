package nle.co.Imov.crudFile;

import nle.co.Imov.model.Anuncio;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AnuncioCrud extends CrudRepository<Anuncio, Integer> {

    // @formatter:off
    @Query("""
            SELECT a FROM Anuncio a
            JOIN FETCH a.imovel i
            JOIN FETCH a.anunciante an
            JOIN FETCH a.tipoAnuncio ta
            WHERE (:ativo          IS NULL OR a.ativo = :ativo)
              AND (:descricao      IS NULL OR LOWER(a.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')))
              AND (:idAnunciante   IS NULL OR an.id = :idAnunciante)
              AND (:tipoImovel     IS NULL OR i.tipoImovel = :tipoImovel)
              AND (:tipoNegocio    IS NULL OR i.tipoNegocio = :tipoNegocio)
              AND (:tipoLocalizacao IS NULL OR i.tipoLocalizacao = :tipoLocalizacao)
              AND (:cidade         IS NULL OR LOWER(i.cidade) LIKE LOWER(CONCAT('%', :cidade, '%')))
              AND (:uf             IS NULL OR i.uf = :uf)
              AND (:valorMin       IS NULL OR i.valor >= :valorMin)
              AND (:valorMax       IS NULL OR i.valor <= :valorMax)
              AND (:quartos        IS NULL OR i.quarto >= :quartos)
              AND (:banheiros      IS NULL OR i.banheiro >= :banheiros)
              AND (:garagens       IS NULL OR i.garagem >= :garagens)
              AND (:categoriaAnuncio IS NULL OR ta.categoria = :categoriaAnuncio)
              AND (:dataInicioMin  IS NULL OR a.dataInicio >= :dataInicioMin)
              AND (:dataFimMax     IS NULL OR a.dataFim <= :dataFimMax)
            ORDER BY a.id DESC
            """)
    List<Anuncio> buscarComFiltros(
            @Param("ativo") Boolean ativo,
            @Param("descricao") String descricao,
            @Param("idAnunciante") Integer idAnunciante,
            @Param("tipoImovel") String tipoImovel,
            @Param("tipoNegocio") String tipoNegocio,
            @Param("tipoLocalizacao") String tipoLocalizacao,
            @Param("cidade") String cidade,
            @Param("uf") String uf,
            @Param("valorMin") java.math.BigDecimal valorMin,
            @Param("valorMax") java.math.BigDecimal valorMax,
            @Param("quartos") Integer quartos,
            @Param("banheiros") Integer banheiros,
            @Param("garagens") Integer garagens,
            @Param("categoriaAnuncio") String categoriaAnuncio,
            @Param("dataInicioMin") LocalDate dataInicioMin,
            @Param("dataFimMax") LocalDate dataFimMax
    );
    // @formatter:on
}
