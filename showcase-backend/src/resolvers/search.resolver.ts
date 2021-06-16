import { Resolver, Arg, Query } from 'type-graphql'
import { fullTextSearch } from '../libs/search/fullTextSearch'
import { FullTextSearchResult } from '../libs/search/types/fullTextSearch.type'

@Resolver()
export class SearchResolver {
  @Query((_returns) => FullTextSearchResult)
  async fullTextSearch(@Arg('search') search: string) {
    return await fullTextSearch(search)
  }
}
