package sample;

import java.util.Arrays;

public class RemoveDuplicatesFromSorted {
	public static void main(String args[]) {
		int[] arr = {1,1,2,2,3,3,3,4,5,6,7,7,9,9,9};
		
		int index = 0;
		
		for (int i = 1; i < arr.length; i++) {
			if(arr[i]!=arr[i-1]) {
				index++;
				arr[index]=arr[i];
				
			}
			
		}
		int[] result = Arrays.copyOf(arr, index+1);
		for (int i : result) {
			System.out.println(i);
		}
		
	}

}
