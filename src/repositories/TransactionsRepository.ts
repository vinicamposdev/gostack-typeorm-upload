import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (a, t) => {
        if(t.type === 'income')
          a.income += Number(t.value);

        if(t.type === 'outcome')
          a.outcome += Number(t.value);
        return a;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
