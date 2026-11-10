package interview.coding1;

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

public class RemoveDuplicatesFromSortedArray {

	public static void main(String[] args) {
		int[] arr = new int[] {1,2,2,3,3,6,6};
		int[] arrIdentical =  removeDuplicates(arr);
		int[] arrIdentical2 =  removeDuplicatesAdvanced(arr);
//		for (int i : arrIdentical) {
//			System.out.println(i);
//		}
		for (int i : arrIdentical2) {
			System.out.println(i);
		}
	}

	private static int[] removeDuplicates(int[] arr) {
		Set<Integer> identical = new LinkedHashSet<>();
		for (int i = 0; i < arr.length; i++) {
			identical.add(arr[i]);
		}
		int[] arrIdentical =  new int[identical.size()];
		int index=0;
		for (int i : identical) {
			arrIdentical[index] = i;
			index++;
		}
		return arrIdentical;
	}

	private static int[] removeDuplicatesAdvanced(int[] arr) {
		int index = 0;
		for (int i = 0; i < arr.length; i++) {
			if(arr[index]!=arr[i]) {
				index++;
				arr[index]=arr[i];
			}
		}
		return Arrays.copyOf(arr, index+1);
	}

}
