package DSA;

public class BinarySearch {
	
	public static void main(String[] args) {
		
		int[] nums= new int[] {1,5,77,33,77,99,109};
		int left =0;
		int right=nums.length-1;
		int mid=(left+right)/2;
		int target=99;
		while(left<=right) {
			if(nums[mid]==target) {
				System.out.println(mid);
				break;
			}else if(nums[mid]<target){
				left=mid+1;
				mid=(left+right)/2;
			}else {
				right=mid-1;
				mid=(left+right)/2;
			}
		}
	}

}
