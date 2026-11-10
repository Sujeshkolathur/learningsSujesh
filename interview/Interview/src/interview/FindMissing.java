package interview;

public class FindMissing {

	public static void main(String[] args) {
		int[] nums= {1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20};
		System.out.println(findMissing(nums));//will print 7
	}
	
	public static Integer findMissing(int[] nums) {
		if(nums.length==0 || nums.length==1) {
			return null;
		}
		if(nums.length==2 && nums[0]-nums[1]>1) {
			return nums[0]+1;
		}
		int largest=Integer.MIN_VALUE;
		int smallest=Integer.MAX_VALUE;
		for(int i=0;i<nums.length;i++) {
			if(nums[i]>largest) {
				largest=nums[i];
			}
			if(nums[i]<smallest) {
				smallest=nums[i];
			}
		}
		for(int i=0;i<nums.length;i++) {
			if(nums[i]==smallest || nums[i]==largest) {
				continue;
			}
			int hasAdjuscent =0;
			for(int j=0;j<nums.length;j++) {
				if(i!=j) {
					if(nums[i]-nums[j]==1 || nums[i]-nums[j]==-1) {
						hasAdjuscent++;
					}
				}
			}
			if(hasAdjuscent<2) {
				for(int j=0;j<nums.length;j++) {
					if(i!=j) {
						if(nums[i]-1==nums[j]) {
							return nums[i]+1;
						}
						if(nums[i]+1==nums[j]) {
							return nums[i]-1;
						}
					}
				}
			}
		}
		return null;
		
	}

}
