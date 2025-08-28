// pdf.service.ts
import * as fs from 'fs';
import * as path from 'path';
import * as PdfPrinter from 'pdfmake';
import { envs } from 'src/configuration';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateGuideDto } from 'src/guides/dto/create-guidebd.dto';
import { GuidesRepository } from 'src/guides/repositories/guides.repository';
import { CloudinaryService } from 'src/commons/cloudinary/cloudinary.service';

@Injectable()
export class PdfService {
  constructor(
    @Inject() private readonly repository: GuidesRepository,
    @Inject() private readonly cloudinary: CloudinaryService,
    @Inject(envs.nats_service_name) private readonly client: ClientProxy,
  ) {}

  async generateOrderPdf(createOrderDto: any) {
    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    const currentYear = new Date().getFullYear();
    const printer = new PdfPrinter(fonts);

    // 📏 tamaño 10x10 cm
    const pageSize = { width: 283.5, height: 283.5 };

    const content = [];
    createOrderDto.products.map((el) => {
      content.push(el.name);
      return el;
    });

    const docDefinition = {
      pageSize,
      pageMargins: [8, 8, 8, 8],
      defaultStyle: { font: 'Helvetica', fontSize: 9 },
      content: [
        // ENCABEZADO (Guía + QR + ciudad + recaudo)
        {
          table: {
            widths: ['70%', '30%'],
            body: [
              [
                {
                  stack: [
                    { text: 'Guía N°', bold: true, fontSize: 9 },
                    { text: createOrderDto.reference, fontSize: 9 },
                    {
                      text: [
                        { text: 'Dirección: ', bold: true, fontSize: 9 },
                        {
                          text: createOrderDto.client.address || '',
                          fontSize: 9,
                        },
                      ],
                      margin: [0, 5, 0, 0],
                    },
                  ],
                },
                {
                  stack: [
                    {
                      qr: createOrderDto.reference,
                      fit: 30,
                      alignment: 'center',
                    },
                    {
                      text: createOrderDto.city || '',
                      alignment: 'center',
                      fontSize: 9,
                      margin: [0, 4, 0, 0],
                    },
                    {
                      text: 'Recaudar',
                      alignment: 'center',
                      fontSize: 8,
                      margin: [0, 4, 0, 0],
                    },
                    {
                      text: `(COP) ${
                        createOrderDto.cash_on_delivery
                          ? createOrderDto.cash_amount
                          : '0,00'
                      }`,
                      alignment: 'center',
                      fontSize: 9,
                      bold: true,
                    },
                  ],
                },
              ],
            ],
          },
          layout: 'borders',
        },

        // CONTENIDO

        {
          table: {
            widths: ['100%'],
            headerRows: 1,
            // Altura fija de filas: encabezado 18pt, contenido 70pt
            heights: (row) => (row === 0 ? 8 : 30),
            body: [
              [{ text: 'Contenido', fontSize: 9, bold: true }],
              [
                {
                  text: content.join(', ').substring(0, 200),
                  fontSize: 8,
                  // Asegura que el texto quede dentro del área
                  alignment: 'left',
                  lineHeight: 1.1,
                  margin: [2, 2, 2, 2],
                },
              ],
            ],
          },
          layout: 'borders',
          margin: [0, 5, 0, 0],
          dontBreakRows: true,
        },

        // REMITENTE / DOMICILIARIO
        {
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                { text: 'Remitente', bold: true, fontSize: 9 },
                { text: 'Domiciliario', bold: true, fontSize: 9 },
              ],
              [
                {
                  text: `${createOrderDto.sender?.brand_name || ''} \n Tel: ${createOrderDto.sender?.brand_phone || ''}`,
                  fontSize: 9,
                },
                { text: createOrderDto.delivery_man?.name || '', fontSize: 9 },
              ],
              [
                { text: 'Destinatario', bold: true, fontSize: 9 },
                { text: 'Teléfono', bold: true, fontSize: 9 },
              ],
              [
                { text: createOrderDto.client?.name || '', fontSize: 9 },
                { text: createOrderDto.client?.phone || '', fontSize: 9 },
              ],
            ],
          },
          layout: 'borders',
          margin: [0, 5, 0, 0],
        },

        // notes
        {
          table: {
            widths: ['100%'],
            headerRows: 1,
            // Altura fija de filas: encabezado 18pt, contenido 70pt
            heights: (row) => (row === 0 ? 8 : 30),
            body: [
              [{ text: 'Observaciones', fontSize: 9, bold: true }],
              [
                {
                  text: createOrderDto.notes.substring(0, 200) || '',
                  fontSize: 8,
                  // Asegura que el texto quede dentro del área
                  alignment: 'left',
                  lineHeight: 1.1,
                  margin: [2, 2, 2, 2],
                },
              ],
            ],
          },
          layout: 'borders',
          margin: [0, 5, 0, 0],
          dontBreakRows: true,
        },

        // footer
        {
          text: `RepartiX - Todos los derechos reservados ${currentYear}`,
          alignment: 'center',
          margin: [0, 15, 0, 0],
          fontSize: 8,
        },
      ],
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const filePath = path.join(
      process.cwd(),
      `pdfs/order-${createOrderDto.parent_id}-${createOrderDto.reference}.pdf`,
    );

    await new Promise((resolve, reject) => {
      pdfDoc.pipe(fs.createWriteStream(filePath));
      pdfDoc.on('end', resolve);
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });

    if (fs.readFileSync(filePath)) {
      setTimeout(async () => {
        const issetGuide = await this.repository.find(
          createOrderDto.reference,
          createOrderDto.parent_id,
        );

        // delete file if isset in cloudinary
        if (issetGuide?.guide_url) {
          await this.cloudinary.deleteFile(issetGuide.guide_url);
        }

        // upload file
        const cloudinaryResult = await this.cloudinary.uploadFilePath(
          filePath,
          `pdf/${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
          `order-${createOrderDto.parent_id}-${createOrderDto.reference}.pdf`,
        );

        // save guide in bbdd
        if (cloudinaryResult?.secure_url) {
          const createGuideDto: CreateGuideDto = {
            order_reference: createOrderDto.reference,
            guide_url: cloudinaryResult.secure_url,
            parent_id: createOrderDto.parent_id,
          };

          if (!issetGuide) {
            await this.repository.create(createGuideDto);
          } else {
            issetGuide.guide_url = cloudinaryResult.secure_url;
            await this.repository.update(issetGuide, issetGuide.id);
          }

          // emit data to order ms
          createGuideDto.status = 'guide-printed';
          this.client.emit('update-status-order', createGuideDto);
          fs.unlinkSync(filePath);
        }
      }, 1500);
    }

    return filePath;
  }
}
