import { Resolver, Arg, Query } from 'type-graphql'
import { feedSearch } from '../libs/search/feedSearch'
import { fullTextSearch } from '../libs/search/fullTextSearch'
import { FullTextSearchResult } from '../libs/search/types/fullTextSearch.type'
import { BadgeType } from '@generated/type-graphql'
import { FeedSearchInput } from '../libs/search/types/feedSearch.type'
import { CursorConnectionResponse } from './types/cursorConnection'
@Resolver()
export class SearchResolver {
  @Query((_returns) => FullTextSearchResult)
  async fullTextSearch(@Arg('search') search: string) {
    return await fullTextSearch(search)
  }

  @Query((_returns) => CursorConnectionResponse)
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
