import { Inject, Injectable } from '@nestjs/common';
import { YoutubeProvider } from '../providers/youtube.provider';
import { MediaProvider } from '../providers/media.provider';
import * as _ from 'lodash';
import { Media, MediaFilter, SourceType } from '../../graphql/ts/types';

@Injectable()
export class MediaRemoteService {
  private readonly providers: {
    [K in SourceType]: MediaProvider;
  };

  constructor(
    @Inject(YoutubeProvider) private readonly youtubeProvider: YoutubeProvider,
  ) {
    this.providers = {
      [SourceType.YOUTUBE]: this.youtubeProvider,
    };
  }

  async search(
    filter: MediaFilter,
    providers: SourceType[],
  ): Promise<[Media[], number]> {
    const resources = await Promise.all(
      providers.map((provider) => this.providers[provider].findAll(filter)),
    );
    return resources.reduce(
      (previousValue, currentValue) => [
        [...previousValue[0], ...currentValue[0]],
        previousValue[1] + currentValue[1],
      ],
      [[], 0],
    );
  }

  async parseFromUrl(url: string): Promise<Media | undefined> {
    const promises = _.values(this.providers).map((provider) =>
      provider.parseFromUrl(url),
    );
    if (promises.length === 0) {
      return undefined;
    }
    const resources = await Promise.all(promises);
    return _.find(resources);
  }

  async findById(
    id: string,
    sourceType: SourceType,
  ): Promise<Media | undefined> {
    return await this.providers[sourceType].findById(id);
  }
}
