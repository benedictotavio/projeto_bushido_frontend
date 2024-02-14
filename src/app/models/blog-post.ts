export interface BlogPost {
    id: string;
    slug: string;
    categoria: string;
    titulo: string;
    _firstPublishedAt: string;
    capa: {
        url: string;
    }
    corpo: string;
    autor: {
        nome: string,
        descricao: string,
        avatar: {
            url: string
        }
    }
}
