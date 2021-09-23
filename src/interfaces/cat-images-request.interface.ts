export interface CatImagesRequestInterface {
    limit: number
    page: number
    order: ['DESC', 'ASC', 'RANDOM']
    format: ['json', 'src']
    include_vote: [1, 0]
    include_favourite: [1, 0]
}