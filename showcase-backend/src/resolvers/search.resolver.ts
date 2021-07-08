import { Resolver, Arg, Query } from 'type-graphql'
import { feedSearch } from '../libs/search/feedSearch'
import { fullTextSearch } from '../libs/search/fullTextSearch'
import { FullTextSearchResponse } from '../libs/search/types/fullTextSearch.type'
import { FeedSearchInput, FeedSearchResponse } from '../libs/search/types/feedSearch.type'
@Resolver()
export class SearchResolver {
  @Query((_returns) => FullTextSearchResponse)
  async fullTextSearch(@Arg('search') search: string) {
    return await fullTextSearch(search)
  }

  @Query((_returns) => FeedSearchResponse)
  async feedSearch(
    @Arg('data', {
      nullable: true,
      defaultValue: { search: null, category: null },
    })
    input: FeedSearchInput
  ) {
    return await feedSearch(input)
  }
}
