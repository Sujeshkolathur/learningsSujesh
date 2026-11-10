package sample;

import java.util.Arrays;

public class RemoveDuplicatesFromSortedArray {

	public static void main(String[] args) {
		int[] arr = new int[] {1,2,3,4,4,5,6,7,7,8,8};
		int index=0;
		
		for (int i = 0; i < arr.length; i++) {
			if(arr[i]!=arr[index]) {
				index++;
				arr[index]=arr[i];
			}
			
		}
		int[] result = Arrays.copyOf(arr, index+1);
		for (int i = 0; i < result.length; i++) {
			System.out.println(result[i]);
			
		}

	}

}
