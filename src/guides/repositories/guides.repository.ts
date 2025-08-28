import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Guides, GuidesDocument } from '../schemas/guide.schema';
import { Injectable, Logger } from '@nestjs/common';
import { GuideEntity } from '../entities/guide.entity';
import { CreateGuideDto } from '../dto/create-guidebd.dto';
import { IGuidesRepository } from 'src/commons/interfaces/repository.interface';

@Injectable()
export class GuidesRepository implements IGuidesRepository {
  logger = new Logger(GuidesRepository.name);

  constructor(
    @InjectModel(Guides.name) private readonly model: Model<Guides>,
  ) {}
  async create(createGuideDto: CreateGuideDto): Promise<GuideEntity | unknown> {
    try {
      return await this.model.create(createGuideDto);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async find(reference: string, parenId: string): Promise<GuideEntity | null> {
    return await this.model.findOne({ order_reference: reference, parent_id: parenId });
  }

  async update(guideDocument: GuideEntity, id: string): Promise<void> {
    return await this.model.findOneAndUpdate({ _id: id }, guideDocument, {
      new: true,
    });
  }
}
