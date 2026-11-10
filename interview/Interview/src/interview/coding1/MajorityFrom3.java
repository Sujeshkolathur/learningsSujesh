package interview.coding1;

import java.util.ArrayList;
import java.util.List;

public class MajorityFrom3 {

	public static void main(String[] args) {
		int[] arr = new int[] { 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 3,2,2,2,3 };
		int candidate1 = 0;
		int count1 = 0;
		int candidate2 = 0;
		int count2 = 0;
		for (int i = 0; i < arr.length; i++) {
			if (candidate1 == arr[i]) {
				count1++;
			} else if (candidate2 == arr[i]) {
				count2++;
			} else if (count1 == 0) {
				candidate1 = arr[i];
				count1++;

			} else if (count2 == 0) {
				candidate2 = arr[i];
				count2++;

			} else {
				count1--;
				count2--;
			}

		}
		count1 = 0;
		count2 = 0;
		for (int i : arr) {
			if (candidate1 == i) {
				count1++;
			}
			if (candidate2 == i) {
				count2++;
			}
		}
		List<Integer> result = new ArrayList<>();

		int n = arr.length;

		if (count1 > n / 3) {
			result.add(candidate1);
		}

		if (count2 > n / 3) {
			result.add(candidate2);
		}
		System.out.println(result);
	}

}
