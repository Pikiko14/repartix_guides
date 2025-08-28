import { GuideEntity } from "src/guides/entities/guide.entity";
import { CreateGuideDto } from "src/guides/dto/create-guidebd.dto";
import { GuidesDocument } from "src/guides/schemas/guide.schema";

export interface IGuidesRepository {
  create(createGuideDto: CreateGuideDto): Promise<GuideEntity | unknown>;
  
  find(reference: string, parenId: string): Promise<GuideEntity | null>;

  update(guideDocument: GuideEntity, id: string): Promise<void>
}
