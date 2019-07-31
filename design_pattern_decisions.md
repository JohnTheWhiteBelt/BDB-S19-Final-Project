# Design Pattern Decisions

All design patterns used and identified for current project are listed below

* **Access Restriction**

    Restrict the access to contract functionality according to suitable criteria. Used OpenZeppelin Ownable base contract, only owner of this contract withdraw ether.

* **Circuit Breaker/Emergency Stop)**
    
    Disable critical contract functionality in case of an emergency.

* **Fail Early and Fail Loud**
    at line 111 ProofOfExistence.sol, when a file is Notarized already, revert right away. 