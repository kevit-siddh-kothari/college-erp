import { Batch, IBatch } from './batch.module';
import { Department, IDepartment } from '../department/department.module';

class BatchDAL {
  public async getAllBatches(): Promise<IBatch[]> {
    return Batch.find({}).lean();
  }

  public async findDepartmentById(departmentId: string): Promise<IDepartment | null> {
    return Department.findById(departmentId);
  }

  public async findBatchByYear(year: string): Promise<IBatch | null> {
    return Batch.findOne({ year });
  }

  public async updateBatch(year: string, departmentId: string, batchData: Partial<IBatch>): Promise<any> {
    return Batch.updateOne(
      {
        'year': year,
        'branches.departmentId': departmentId,
      },
      {
        $set: {
          'branches.$': batchData,
        },
      }
    );
  }

  public async addBranchToBatch(year: string, branchData: Partial<IBatch>): Promise<any> {
    return Batch.updateOne(
      {
        'year': year,
        'branches.departmentId': { $ne: branchData.departmentId },
      },
      {
        $push: { branches: branchData },
      }
    );
  }

  public async createBatch(batchData: IBatch[]): Promise<IBatch[]> {
    return Batch.create(batchData);
  }
}

export const batchDAL = new BatchDAL();
