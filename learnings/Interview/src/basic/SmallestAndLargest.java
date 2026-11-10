package basic;

import java.util.Arrays;

public class SmallestAndLargest {
	public static void main(String[] args) {
		
		int[] array = {1,3,7,33,6,66,8,99};
		int largest = Integer.MIN_VALUE;
		int smallest= Integer.MAX_VALUE;
		for (int i : array) {
			if(i>largest) {
				largest=i;
				
			}
			if(i<smallest) {
				smallest=i;
				
			}
		}
		System.out.println("smallest = "+smallest+"largest= "+largest);
		int min = Arrays.stream(array).min().getAsInt();
		int max = Arrays.stream(array).max().getAsInt();
		System.out.println("Smallest= "+min);
		System.out.println("largest= "+max);
		
		
		
		
	
	}

}
