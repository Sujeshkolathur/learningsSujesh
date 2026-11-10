package interview.coding1;

import java.util.Arrays;

public class FindMissingNumber {

	public static void main(String[] args) {
		int[] arr = new int[] {1,2,3,4,6,7,8,9};
		int sum = Arrays.stream(arr).sum();//to find the sum of numbers
		int n = arr[arr.length-1];
		int actualSum = n*(n+1)/2;//find sum of numbers till n
		System.out.println(actualSum-sum);

	}

}
