package interview.coding1;

import java.util.HashSet;
import java.util.Set;

public class LongestConsecutiveSequence {

	public static void main(String[] args) {
		int[] arr = {100, 4, 200, 1, 3, 2};
		Set<Integer> nums = new HashSet<>();
		for (int i : arr) {
			nums.add(i);
		}
		int maxLength=0;
		for (Integer integer : nums) {
			if(!nums.contains(integer-1)) {
				int length =1;
				while(nums.contains(integer+1)) {
					length++;
					integer++;
					
				}
				maxLength=Math.max(maxLength, length);
			}
		}
		System.out.println(maxLength);
	}

}
