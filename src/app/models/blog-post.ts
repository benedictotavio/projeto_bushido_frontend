export interface BlogPost {
    id: string;
    categoria: string;
    titulo: string;
    _firstPublishedAt: string;
    capa: {
        url: string;
    }
    corpo: string;
}
