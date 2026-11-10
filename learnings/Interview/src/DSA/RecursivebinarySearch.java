package DSA;

public class RecursivebinarySearch {

	
	public static void main(String[] args) {
		
		int[] nums= new int[] {1,5,77,33,77,99,109};
		int target=99;
		int left =0;
		int right=nums.length-1;
		int index = binarySearch(nums, target, left, right);
		System.out.println(index);
	}

	private static int binarySearch(int[] nums, int target, int left, int right) {
	
		int mid=(left+right)/2;
		
		if(nums[mid]==target) {
			return mid;
		}else if(nums[mid]<target){
			return binarySearch(nums, target, mid+1, right);
		}else if(nums[mid]>target){
			return binarySearch(nums, target, left, mid-1);
		}
		return -1;
	}


	

}
