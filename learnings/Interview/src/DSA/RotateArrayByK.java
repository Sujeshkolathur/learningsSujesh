package DSA;

public class RotateArrayByK {
	 public static void main(String[] args) {
	        int[] nums = {1,2,3,4,5,6,7};
	        rotate(nums, 3);

	        for (int num : nums) {
	            System.out.print(num + " ");
	        }
	        // Output: 5 6 7 1 2 3 4
	    }

	private static void rotate(int[] nums, int k) {
		k=k%nums.length;
		reverse(0,nums.length-1,nums);
		reverse(0,k-1,nums);
		reverse(k,nums.length-1,nums);
		
	}

	private static void reverse(int start, int end, int[] nums) {
		while(end>start) {
			int temp=nums[start];
			nums[start]=nums[end];
			nums[end]=temp;
			end--;
			start++;
		}
		
	}

}
