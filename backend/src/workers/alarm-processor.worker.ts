import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('alarm-process')
export class AlarmProcessorWorker extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> { return true; }
}
