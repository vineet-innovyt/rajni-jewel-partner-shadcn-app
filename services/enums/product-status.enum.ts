export enum ProductStatusEnum {
    /**
   * The product is a draft. It's not viewable by customers.
   */
    DRAFT = "draft",
    /**
     * The product is proposed, but not yet published.
     */
    PROPOSED = "proposed",
    /**
     * The product is published.
     */
    PUBLISHED = "published",
    /**
     * The product is rejected. It's not viewable by customers.
     */
    REJECTED = "rejected"

}