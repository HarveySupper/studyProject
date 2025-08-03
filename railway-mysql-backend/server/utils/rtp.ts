import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

let connection: mysql.Connection | null = null

export const vendorReturnRateMap: Record<string, number> = {
  PG: 0.98,
  Spribe: 0.97,
  Evolution: 0.96,
  Tada: 0.95,
};

export function generateGameResult(betAmount: number, returnRate: number): number {
  const expectedReturn = betAmount * returnRate;
  const variation = betAmount * 0.1;
  const result = expectedReturn + (Math.random() * variation * 2 - variation);
  return Math.round(result - betAmount);
}