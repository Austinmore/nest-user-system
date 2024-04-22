import { IsNumber, Min } from 'class-validator';

export class FundWalletDto {
    @IsNumber()
    @Min(0.01, { message: 'The minimum amount to fund must be at least $0.01.' })
    value: number;
}
