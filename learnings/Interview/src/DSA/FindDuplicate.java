package DSA;

public class FindDuplicate {

	public static void main(String[] args) {
		int[] nums = {1, 3, 4, 2, 4};
        System.out.println("Duplicate Number: " + findDuplicate(nums));

	}

	private static int findDuplicate(int[] nums) {
		
		int slow= nums[0];//1
		int fast=nums[0];//1
		do {
			slow=nums[slow];//3,2,4
			fast=nums[nums[fast]];//2,4,4
			
		}while(slow!=fast);
		
		return slow;
	}

}
