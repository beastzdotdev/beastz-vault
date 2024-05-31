import { FileStructureApiService, api } from '../../../../shared/api';
import { constants } from '../../../../shared/constants';
import { sleep } from '../../../../shared/helper';
import { Inject, Singleton } from '../../../../shared/ioc';
import { RootFileStructure } from '../../../../shared/model';
import { toast } from '../../../../shared/ui';
import { SharedController } from '../../state/shared.controller';
import { FileViewStore } from './file-view-store';

@Singleton
export class FileViewController {
  @Inject(FileViewStore)
  private readonly fileViewStore: FileViewStore;

  @Inject(SharedController)
  private readonly sharedController: SharedController;

  @Inject(FileStructureApiService)
  private readonly fileStructureApiService: FileStructureApiService;

  async setTextInitial(item: RootFileStructure): Promise<void> {
    //TODO: needs loading for big text files but loading is taken so add textFetchLoading
    if (item.isEncrypted || !item.absRelativePath) {
      return;
    }

    let finalText = '';

    try {
      const url = item.absRelativePath.replace(constants.path.backend.url, '');
      const textResponse = await api.get(url, { responseType: 'text' });

      finalText = textResponse.data;
    } catch (error) {
      finalText = '';
    }

    this.fileViewStore.setText(finalText);
  }

  async saveText(item: RootFileStructure, text: string) {
    console.log(text === this.fileViewStore.text);
    if (text === this.fileViewStore.text) {
      return;
    }
    this.fileViewStore.setTextSaveLoading(true);
    const startTime = new Date(); // Start time
    const { data, error } = await this.fileStructureApiService.replaceTextById(item.id, {
      text,
    });
    const endTime = new Date();
    // this is necessary because if axios took less than 200ms animation seems weird
    if (endTime.getTime() - startTime.getTime() < 200) {
      // add another 400 ms waiting
      await sleep(400);
    }

    this.fileViewStore.setTextSaveLoading(false);
    if (error || !data) {
      toast.error(error?.message || 'Sorry, something went wrong');
      return;
    }
    this.sharedController.createFileStructureInState(data, true);
    this.fileViewStore.setIsModalOpen(false);
  }
}
