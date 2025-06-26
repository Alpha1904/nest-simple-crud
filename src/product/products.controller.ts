import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  ValidationPipe,
  Res,
  NotFoundException,
  Query,
  ParseFloatPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  create(
    createProductDto: CreateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, image);
  }

  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('minPrice', new ParseFloatPipe({ optional: true }))
    minPrice?: number,
    @Query('maxPrice', new ParseFloatPipe({ optional: true }))
    maxPrice?: number,
  ) {
    const hasFilters = name || minPrice !== undefined || maxPrice !== undefined;

    if (hasFilters) {
      return this.productsService.findByFilters({ name, minPrice, maxPrice });
    }

    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get(':id/image')
  async getImage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const product = await this.productsService.findOne(id);

    if (!product.imageUrl || !fs.existsSync(product.imageUrl)) {
      throw new NotFoundException('Image not found');
    }

    const fileExtension = path.extname(product.imageUrl);
    const mimeType = this.getMimeType(fileExtension);

    res.setHeader('Content-Type', mimeType);
    res.sendFile(path.resolve(product.imageUrl));
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.productsService.update(id, updateProductDto, image);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  private getMimeType(extension: string): string {
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }
}
