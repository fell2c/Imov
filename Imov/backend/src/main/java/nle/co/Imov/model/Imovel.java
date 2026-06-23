package nle.co.Imov.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "imovel")
public class Imovel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "DESCRICAO", length = 150, nullable = false)
    private String descricao;

    @Column(name = "OBSERVACAO", columnDefinition = "text")
    private String observacao;

    @Column(name = "TIPO_IMOVEL", length = 1, nullable = false)
    private String tipoImovel; // C, A, L

    @Column(name = "TIPO_NEGOCIO", length = 1, nullable = false)
    private String tipoNegocio; // A, V, T

    @Column(name = "VALOR", precision = 15, scale = 2, nullable = false)
    private BigDecimal valor;

    @Column(name = "TIPO_LOCALIZACAO", length = 1, nullable = false)
    private String tipoLocalizacao; // U, R

    @Column(name = "ENDERECO", length = 100, nullable = false)
    private String endereco;

    @Column(name = "NUMERO_ENDERECO", length = 10)
    private String numeroEndereco;

    @Column(name = "COMPLEMENTO", length = 100)
    private String complemento;

    @Column(name = "CEP", length = 9)
    private String cep;

    @Column(name = "BAIRRO", length = 50)
    private String bairro;

    @Column(name = "CIDADE", length = 50, nullable = false)
    private String cidade;

    @Column(name = "UF", length = 2, nullable = false)
    private String uf;

    @Column(name = "PAIS", length = 2, nullable = false)
    private String pais;

    @Column(name = "AREA_PRIVATIVA", precision = 15, scale = 2)
    private BigDecimal areaPrivativa;

    @Column(name = "AREA_CONSTRUIDA", precision = 15, scale = 2)
    private BigDecimal areaConstruida;

    @Column(name = "AREA_EXTERNA", precision = 15, scale = 2)
    private BigDecimal areaExterna;

    @Column(name = "AREA_TOTAL", precision = 15, scale = 2)
    private BigDecimal areaTotal;

    @Column(name = "SUITE")
    private Integer suite;

    @Column(name = "BANHEIRO")
    private Integer banheiro;

    @Column(name = "QUARTO")
    private Integer quarto;

    @Column(name = "GARAGEM")
    private Integer garagem;

    @Column(name = "MOBILIADO", length = 1)
    private String mobiliado; // S, M, N

    @Column(name = "HOSPEDE")
    private Integer hospede;

    @Column(name = "DETALHES", columnDefinition = "text")
    private String detalhes;

    @JsonIgnore
    @OneToMany(mappedBy = "imovel", fetch = FetchType.LAZY)
    private List<Anuncio> anuncios = new ArrayList<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public String getTipoImovel() {
        return tipoImovel;
    }

    public void setTipoImovel(String tipoImovel) {
        this.tipoImovel = tipoImovel;
    }

    public String getTipoNegocio() {
        return tipoNegocio;
    }

    public void setTipoNegocio(String tipoNegocio) {
        this.tipoNegocio = tipoNegocio;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getTipoLocalizacao() {
        return tipoLocalizacao;
    }

    public void setTipoLocalizacao(String tipoLocalizacao) {
        this.tipoLocalizacao = tipoLocalizacao;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getNumeroEndereco() {
        return numeroEndereco;
    }

    public void setNumeroEndereco(String numeroEndereco) {
        this.numeroEndereco = numeroEndereco;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public BigDecimal getAreaPrivativa() {
        return areaPrivativa;
    }

    public void setAreaPrivativa(BigDecimal areaPrivativa) {
        this.areaPrivativa = areaPrivativa;
    }

    public BigDecimal getAreaConstruida() {
        return areaConstruida;
    }

    public void setAreaConstruida(BigDecimal areaConstruida) {
        this.areaConstruida = areaConstruida;
    }

    public BigDecimal getAreaExterna() {
        return areaExterna;
    }

    public void setAreaExterna(BigDecimal areaExterna) {
        this.areaExterna = areaExterna;
    }

    public BigDecimal getAreaTotal() {
        return areaTotal;
    }

    public void setAreaTotal(BigDecimal areaTotal) {
        this.areaTotal = areaTotal;
    }

    public Integer getSuite() {
        return suite;
    }

    public void setSuite(Integer suite) {
        this.suite = suite;
    }

    public Integer getBanheiro() {
        return banheiro;
    }

    public void setBanheiro(Integer banheiro) {
        this.banheiro = banheiro;
    }

    public Integer getQuarto() {
        return quarto;
    }

    public void setQuarto(Integer quarto) {
        this.quarto = quarto;
    }

    public Integer getGaragem() {
        return garagem;
    }

    public void setGaragem(Integer garagem) {
        this.garagem = garagem;
    }

    public String getMobiliado() {
        return mobiliado;
    }

    public void setMobiliado(String mobiliado) {
        this.mobiliado = mobiliado;
    }

    public Integer getHospede() {
        return hospede;
    }

    public void setHospede(Integer hospede) {
        this.hospede = hospede;
    }

    public String getDetalhes() {
        return detalhes;
    }

    public void setDetalhes(String detalhes) {
        this.detalhes = detalhes;
    }

    public List<Anuncio> getAnuncios() {
        return anuncios;
    }

    public void setAnuncios(List<Anuncio> anuncios) {
        this.anuncios = anuncios;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Imovel imovel = (Imovel) o;
        return Objects.equals(id, imovel.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
