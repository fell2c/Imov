package nle.co.Imov.service;

import jakarta.transaction.Transactional;
import nle.co.Imov.crudFile.ImovelImagemCrud;
import nle.co.Imov.model.Imovel;
import nle.co.Imov.model.ImovelImagem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@Transactional
public class ImagemService {

    private final ImovelImagemCrud imovelImagemCrud;

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    public ImagemService(ImovelImagemCrud imovelImagemCrud) {
        this.imovelImagemCrud = imovelImagemCrud;
    }

    /** Salva os arquivos em disco e registra os nomes vinculados ao imovel. */
    public List<String> salvarImagens(Imovel imovel, MultipartFile[] arquivos) throws IOException {
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);

        List<String> nomes = new ArrayList<>();
        for (MultipartFile arquivo : arquivos) {
            if (arquivo.isEmpty()) {
                continue;
            }
            String original = arquivo.getOriginalFilename();
            String extensao = (original != null && original.contains(".")) ? original.substring(original.lastIndexOf('.')) : "";
            String nomeArquivo = UUID.randomUUID() + extensao;

            Path destino = dir.resolve(nomeArquivo);
            Files.copy(arquivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            ImovelImagem imagem = new ImovelImagem();
            imagem.setImovel(imovel);
            imagem.setNomeArquivo(nomeArquivo);
            imovelImagemCrud.save(imagem);

            nomes.add(nomeArquivo);
        }
        return nomes;
    }
}
