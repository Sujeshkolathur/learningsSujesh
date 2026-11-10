package interview.coding1;

public class TargetIfArraySorted {

	public static void main(String[] args) {
		int[] arr = {1,2,3,4,5,6,7,88,99};
		int target = 102;
		int sum;
		int left = 0;
		int right=arr.length-1;
		while(left<right) {
			sum=arr[left]+arr[right];
			if(sum==target) {
				System.out.println(left+"  "+right);
				break;
			}else if(sum<target) {
				left++;
			}else {
				right--;
			}
		}
		
		

	}

}
