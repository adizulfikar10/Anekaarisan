import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IArisanState {
  arisans: IResult;
  arisanData: IArisanData;
  loadingFetchArisans: boolean;
  loadingCreateArisan: boolean;
  loadingUpdateArisan: boolean;
  loadingDeleteArisan: boolean;
  eventErrorArisan: IErrorState;
  eventSuccessArisan: ISuccessState;
}
export interface IArisanData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  sequence_code: string;
  duration: number;
  start_date: Date | null;
  end_date: Date | null;
  total_funds: number;
  average_funds: number;
  status: string;
  user_id: string;
}
