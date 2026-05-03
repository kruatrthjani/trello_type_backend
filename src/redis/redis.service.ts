import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: RedisClientType;

  constructor() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = process.env.REDIS_PORT || '6379';
    const username = process.env.REDIS_USERNAME || 'default';
    const password = process.env.REDIS_PASSWORD;

    this.client = createClient({
      username,
      password,
      socket: {
        host,
        port: parseInt(port),
      },
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));

    this.client.connect().catch(console.error);
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  // async modify(key:string,value:string):Promise<void>{
  //   if(key){
  //     await this.client
  //   }
  // }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return await this.client.exists(key);
  }

  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }
}