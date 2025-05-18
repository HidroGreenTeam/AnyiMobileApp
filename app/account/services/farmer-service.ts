import apiService from "@/shared/services/apiService";
import { AxiosResponse } from 'axios';

export interface Farmer {
    id: number;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    imageUrl: string;
}

export interface FarmerResponse {
    email: string;
    id: number;
    imageUrl: string | null;
    password: string;
    phoneNumber: string;
    username: string;
}

export interface UpdateFarmerDto {
    username?: string;
    phoneNumber?: string;
}

export default class FarmerService {
    // CREATE A FARMER 
    async createFarmer(farmer: Farmer): Promise<Farmer> {
        // passing except the id and imageUrl
        const response = await apiService.post('/farmers', farmer);
        console.log("FarmerService.createFarmer response:", response);  
        return response as unknown as Farmer;
    }
    
    // @Parms farmerId: number
    // this is the same hash id as the user id
    async getFarmer(farmerId: number): Promise<FarmerResponse> {
        const response = await apiService.get(`/farmers/${farmerId}`);
        console.log("FarmerService.getFarmer response:", response);
        return response as unknown as FarmerResponse;
    }

    async updateFarmer(farmerId: number, data: UpdateFarmerDto): Promise<FarmerResponse> {
        const response = await apiService.put(`/farmers/${farmerId}`, data);
        console.log("FarmerService.updateFarmer response:", response);
        return response as unknown as FarmerResponse;
    }

    async uploadFarmerImage(farmerId: number, formData: FormData): Promise<FarmerResponse> {
        const response = await apiService.upload(`/farmers/${farmerId}/farmerImage`, formData);
        console.log("FarmerService.uploadFarmerImage response:", response);
        return response as unknown as FarmerResponse;
    }
}
