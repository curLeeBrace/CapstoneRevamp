
import { Request, Response } from 'express';
import AccountSchema from '../../db_schema/AccountSchema';

export const delete_Acc = async (req: Request, res: Response) => {
  const { accountId } = req.params;

  try {
    const account = await AccountSchema.findByIdAndDelete(accountId);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json({ message: 'Account successfully deleted' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
