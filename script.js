/**
 * Create Flight Transaction
 * @param {testnetwork.borrowedLoanAmount} Data
 * @transaction
 */

async function newasset(Data){
  const factory = getFactory();
  const registry = getAssetRegistry();
  
  const ns = 'testnetwork';
  
  const borrower = factory.newResource(ns, 'Borrower', 'BOR_014');
  
  const details = factory.newConcept(ns,'Details');
  details.fullName = Data.fullName;
  details.panNumber = Data.panNumber;
  details.aadharNumber = Data.aadharNumber;
  details.mobile = Data.mobile;  
  borrower.details = details;
  
  const bdetails = factory.newConcept(ns,'Bdetails');
  
  bdetails.amountBorrowed = Data.amountBorrowed;
  bdetails.lenderName = Data.lenderName;
  bdetails.lenderPanNumber = Data.lenderPanNumber;
  bdetails.period = Data.period;  
  bdetails.orgName = Data.orgName
  borrower.bdetails = bdetails;
  
  const borRegistry = await getAssetRegistry(ns + '.Borrower');
  
  await borRegistry.addAll([borrower]);
  
 const sumRegistry = await getAssetRegistry('testnetwork.Summary');

  try{
    const id = await sumRegistry.get(Data.panNumber)
    id.totalBorrowed = id.totalBorrowed + Data.amountBorrowed;
    id.paid = id.paid + Data.paid
    var arr1 = id.associatedOrgs.includes(Data.orgName)
    if (arr1 === false){
      id.associatedOrgs.push(Data.orgName)
    }
    if (Data.defaulter=== true){
      if(id.defaultedOrgs.includes(Data.orgName) === false){
        id.defaultedOrgs.push(Data.orgName);
      }
    }
    id.dpd.push(Data.dpd);
    id.balance = id.totalBorrowed - id.paid;
    if (id.lenders.includes(Data.lenderPanNumber) === true){
       var ind = id.lenders.indexOf(Data.lenderPanNumber);
       id.lenderLoans[ind] = Data.amountBorrowed + id.lenderLoans[ind];
    }
    else{
      id.lenders.push(Data.lenderPanNumber);
      id.lenderLoans.push(Data.amountBorrowed);
    }
    
    id.liveOrgs.push(Data.orgName);
    id.liveLoans.push(Data.amountBorrowed);    
    if (id.balance >1000000){
      const alert = getFactory().newEvent(ns,'borrowerGreaterThanTenLakh');
      alert.borrowerName = Data.borrowerName;
      alert.borrowerPanNumber = Data.panNumber;
      alert.amount = id.balance
    }
    
 	emit(alert);
    await sumRegistry.update(id);
   
  }
  catch(err){ 
    const summary = factory.newResource(ns, 'Summary', Data.panNumber);
    summary.totalBorrowed = Data.amountBorrowed;
    summary.paid = Data.paid;
    summary.associatedOrgs = [];
    summary.associatedOrgs.push(Data.orgName);
    summary.defaultedOrgs =[];
    if (Data.defaulter === true){
    summary.defaultedOrgs.push(Data.orgName);
    }
    summary.dpd =[];
   	summary.dpd.push(Data.dpd);
    summary.balance = summary.totalBorrowed - summary.paid;
    summary.lenders = [];
   	summary.lenders.push(Data.lenderPanNumber);
    summary.lenderLoans =[];
    summary.lenderLoans.push(Data.amountBorrowed);
    summary.liveOrgs =[];
    summary.liveOrgs.push(Data.orgName);
    summary.liveLoans =[];
    summary.liveLoans.push(Data.amountBorrowed);  
    
    await sumRegistry.addAll([summary]); 
  

} 
}
