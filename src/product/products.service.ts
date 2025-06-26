import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, imageFile?: Express.Multer.File): Promise<Product> {
    let imageUrl: string | undefined;
    
    if (imageFile) {
      imageUrl = await this.saveImage(imageFile);
    }

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        imageUrl,
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, imageFile?: Express.Multer.File): Promise<Product> {
    const existingProduct = await this.findOne(id);
    
    let imageUrl = existingProduct.imageUrl;
    
    if (imageFile) {
      // Delete old image if exists
      if (existingProduct.imageUrl) {
        await this.deleteImage(existingProduct.imageUrl);
      }
      imageUrl = await this.saveImage(imageFile);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        ...(imageFile && { imageUrl }),
      },
    });
  }

  async remove(id: number): Promise<Product> {
    const product = await this.findOne(id);
    
    // Delete associated image
    if (product.imageUrl) {
      await this.deleteImage(product.imageUrl);
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async findByFilters(filters: {
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
  }): Promise<Product[]> {
    const { name, minPrice, maxPrice, isActive } = filters;

    return this.prisma.product.findMany({
      where: {
        ...(name && { name: { contains: name } }),
        ...(minPrice !== undefined && { price: { gte: minPrice } }),
        ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      },
      orderBy: { createdAt: 'desc' },
    });

    
  }

  private async saveImage(file: Express.Multer.File): Promise<string> {
    const uploadDir = 'uploads/products';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadDir, fileName);
    
    fs.writeFileSync(filePath, file.buffer);
    
    return filePath;
  }

  private async deleteImage(imagePath: string): Promise<void> {
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
}